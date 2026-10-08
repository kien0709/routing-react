import { Alert, Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // doorsturen na het inloggen doet publicroute naar de pagina die je eerst wilde openen
  const { authError, login, loginWithGoogle, register, sessionExpired } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || (isRegistering && !name.trim())) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(email.trim(), password, name.trim());
      } else {
        await login(email.trim(), password);
      }

    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering((current) => !current);
    setErrorMessage("");
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      } else {
        setErrorMessage("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex align="center" bg="bg.muted" justify="center" minH="100vh" p={4}>
      <Box
        bg="bg.panel"
        borderRadius="20px"
        boxShadow="0 20px 50px rgba(32, 31, 54, 0.12)"
        maxW="420px"
        p={{ base: 6, md: 8 }}
        w="100%"
      >
        <Heading color="fg" fontSize="32px" mb={2}>
          {isRegistering ? "Create account" : "Login"}
        </Heading>
        <Text color="fg.muted" mb={8}>
          {isRegistering ? "Register to get started." : "Sign in to continue."}
        </Text>

        {/* automatisch uitgelogd omdat de backend je token niet meer accepteerde */}
        {sessionExpired && (
          <Alert.Root borderRadius="12px" mb={6} status="warning">
            <Alert.Indicator />
            <Alert.Title>Your session has expired, please log in again.</Alert.Title>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <Box mb={5}>
              <Text color="fg" fontSize="14px" fontWeight="medium" mb={2}>
                Name
              </Text>
              <Input
                borderRadius="12px"
                color="fg"
                id="name"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Your name"
                required
                type="text"
                value={name}
              />
            </Box>
          )}
          <Box mb={5}>
            <Text color="fg" fontSize="14px" fontWeight="medium" mb={2}>
              Email
            </Text>
            <Input
              borderRadius="12px"
              color="fg"
              id="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@example.com"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "var(--color-primary)", boxShadow: "0 0 0 1px var(--color-primary)" }}
              required
              type="email"
              value={email}
            />
          </Box>

          <Box mb={6}>
            <Text color="fg" fontSize="14px" fontWeight="medium" mb={2}>
              Password
            </Text>
            <Flex align="center" position="relative">
              <Input
                borderRadius="12px"
                color="fg"
                id="password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "var(--color-primary)", boxShadow: "0 0 0 1px var(--color-primary)" }}
                pr="44px"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <Button
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                position="absolute"
                right="4px"
                size="sm"
                type="button"
                variant="ghost"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </Flex>
          </Box>

          {(errorMessage || authError) && (
            <Text color="red.500" fontSize="14px" mb={4} role="alert">
              {errorMessage || authError}
            </Text>
          )}

          <Button
            bg="var(--color-primary)"
            borderRadius="12px"
            color="white"
            h="48px"
            loading={isSubmitting}
            loadingText={isRegistering ? "Creating account" : "Signing in"}
            type="submit"
            w="100%"
            _hover={{ bg: "var(--color-primary-hover)" }}
          >
            {isRegistering ? "Create account" : "Sign in"}
          </Button>

          <Button
            borderRadius="12px"
            h="48px"
            mt={3}
            onClick={toggleMode}
            type="button"
            variant="outline"
            w="100%"
          >
            {isRegistering ? "Back to Login" : "Sign Up"}
          </Button>

          <Flex align="center" gap={3} my={5}>
            <Box bg="border" h="1px" flex="1" />
            <Text color="fg.muted" fontSize="sm">or</Text>
            <Box bg="border" h="1px" flex="1" />
          </Flex>

          <Button
            borderRadius="12px"
            disabled={isSubmitting}
            h="48px"
            onClick={handleGoogleLogin}
            type="button"
            variant="outline"
            w="100%"
          >
            <FcGoogle />
            Continue with Google
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
